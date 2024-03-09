import { format, getMonth, getYear } from "date-fns";
import { useSearchParams } from "next/navigation";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import axiosClient from "src/axios";
import CreateTaskModal from "src/components/CreateTaskModal";
import UpdateTaskModal from "src/components/UpdateTaskModal";
import { getCurrencyRate } from "src/services/currency";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  getMonths,
} from "src/services/tasks";
import { FaPlus } from "react-icons/fa6";
import { SlRefresh } from "react-icons/sl";
const today = new Date();
const thisMonth = getMonth(today) + 1;
const thisYear = getYear(today);

const initialValue = {
  project: "Susu",
  from: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  to: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  rate: 8,
  description: "",
};

export default function Tasks({ data, totalAmount, months }) {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState(data);
  const [createBody, setCreateBody] = useState(initialValue);
  const [amount, setAmount] = useState(totalAmount);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [updateBody, setUpdateBody] = useState();
  const searchParams = useSearchParams();

  const month = searchParams.get("month") || thisMonth;
  const year = searchParams.get("year") || thisYear;

  const [selectingTab, setSelectingTab] = useState({
    month,
    year,
  });

  const handleChangeTab = (m) => {
    setSelectingTab({
      month: m.month,
      year: m.year,
    });
  };

  const handleChangeForm = (e) => {
    setCreateBody({
      ...createBody,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeUpdateForm = (e) => {
    setUpdateBody({
      ...updateBody,
      [e.target.name]: e.target.value,
    });
  };

  const deleteOne = async (id) => {
    await deleteTask(id);
    refreshData();
  };

  const getTasksData = async (month, year) => {
    setIsLoading(true);
    const res = await getTasks(month, year);
    setAmount(
      res.data?.reduce((acc, item) => {
        return (acc += item.hours * item.rate);
      }, 0)
    );

    setTasks(res.data);
    setIsLoading(false);
  };

  const refreshData = async () => {
    setCreateBody(initialValue);
    await getTasksData(selectingTab.month, selectingTab.year);
  };

  const showCreateModal = () => {
    document.getElementById("my_modal_3").showModal();
  };

  const createOne = async () => {
    await createTask(createBody);
    refreshData();
    document.getElementById("my_modal_3").close();
  };

  const showUpdateModal = (body) => {
    document.getElementById("my_modal_4").showModal();
    setUpdateBody(body);
  };

  const updateOne = async () => {
    await updateTask(updateBody._id, {
      project: updateBody.project,
      from: updateBody.from,
      to: updateBody.to,
      rate: updateBody.rate,
      description: updateBody.description,
    });
    refreshData();
    document.getElementById("my_modal_4").close();
  };

  const handleGetAmount = async () => {
    const currency = await getCurrencyRate();
    let fromRate = currency.rates["USD"];
    let toRate = currency.rates["VND"];
    setConvertedAmount(
      numeral(Math.round((toRate / fromRate) * amount)).format(0, 0, 0)
    );
  };

  useEffect(() => {
    handleGetAmount();
  }, [amount]);

  useEffect(() => {
    if (selectingTab.month && selectingTab.year) {
      getTasksData(selectingTab.month, selectingTab.year);
    }
  }, [selectingTab]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-end w-full">
        <div className="btn btn-primary" onClick={showCreateModal}>
          <FaPlus size={16} />
        </div>
        <div className="btn btn-outline btn-primary" onClick={refreshData}>
          <SlRefresh size={16} />
        </div>
      </div>
      <h3 className="font-bold my-2">Reports</h3>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search Project - Not work now"
          disabled
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      <div className="overflow-x-auto">
        <div role="tablist" className="tabs tabs-boxed flex">
          {months.map((m, idx) => (
            <a
              role="tab"
              className={`tab ${
                `${selectingTab.month}/${selectingTab.year}` ===
                `${m.month}/${m.year}`
                  ? "tab-active"
                  : ""
              }`}
              key={idx}
              onClick={() => handleChangeTab(m)}
            >
              {`${m.month}/${m.year}`}
            </a>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">
          <span className="loading loading-infinity loading-lg text-success"></span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Project name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Duration</th>
                  <th>Rate</th>
                  <th>Paid?</th>
                  <th>Description / Task Name</th>
                  <th>Amount</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {tasks?.map((d, idx) => (
                  <tr key={d.id}>
                    <th>{idx + 1}</th>
                    <th>{d.project}</th>
                    <td>{format(new Date(d.from), "dd/MM/yyyy HH:mm")}</td>
                    <td>{format(new Date(d.to), "dd/MM/yyyy HH:mm")} </td>
                    <td>{d.hours}</td>
                    <td>{d.rate}</td>
                    <td>{d.isPaid ? "Paid" : "Unpaid"}</td>
                    <td>{d.description}</td>
                    <td>
                      <div className="badge badge-secondary badge-outline">
                        {d.hours * d.rate}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-primary btn-outline btn-sm"
                          onClick={() => showUpdateModal(d)}
                        >
                          <MdOutlineEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => deleteOne(d._id)}
                        >
                          <MdDeleteOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fixed bg-green-500 left-0 bottom-0 w-full">
            <div className="container mx-auto p-4">
              <div className="flex justify-end gap-2 text-2xl items-center">
                <b>Total: </b>
                {tasks?.reduce((acc, item) => {
                  return (acc += item.hours * item.rate);
                }, 0)}{" "}
                <strong>USD</strong>
              </div>

              <div className="flex justify-end gap-4 text-xl">
                = {convertedAmount} <strong>VND</strong>
              </div>
            </div>
          </div>
        </>
      )}

      <CreateTaskModal
        data={createBody}
        handleChangeForm={handleChangeForm}
        onCreate={createOne}
      />
      <UpdateTaskModal
        data={updateBody}
        handleChangeForm={handleChangeUpdateForm}
        onCreate={updateOne}
      />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const res = await axiosClient.get(
    `/api/tasks?month=${ctx.query.month || thisMonth}&year=${
      ctx.query.year || thisYear
    }`
  );
  const amount = res.data?.reduce((acc, item) => {
    return (acc += item.hours * item.rate);
  }, 0);
  const months = await getMonths();
  return {
    props: { data: res.data, totalAmount: amount, months: months.data },
  };
}
