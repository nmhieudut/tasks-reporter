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

const initialValue = {
  date: format(new Date(), "yyyy-MM-dd"),
  hours: 0,
  rate: 8,
  isPaid: false,
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

  const month = searchParams.get("month");
  const year = searchParams.get("year");

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
      date: updateBody.date,
      hours: updateBody.hours,
      rate: updateBody.rate,
      description: updateBody.description,
    });
    refreshData();
    document.getElementById("my_modal_4").close();
  };

  const handleGetAmount = async () => {
    const res = await getCurrencyRate("USD", "VND");
    setConvertedAmount(numeral(res * amount).format("0,0"));
  };

  useEffect(() => {
    handleGetAmount();
  }, [amount]);

  useEffect(() => {
    getTasksData(selectingTab.month, selectingTab.year);
  }, [selectingTab]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-end w-full">
        <div className="btn btn-primary" onClick={showCreateModal}>
          Create
        </div>
        <div className="btn btn-secondary" onClick={refreshData}>
          Refresh
        </div>
      </div>
      <h3 className="font-bold my-4">Tasks Manager</h3>
      <div role="tablist" className="tabs tabs-bordered">
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
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Paid?</th>
                  <th>Amount</th>
                  <th>Description / Task Name</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {tasks?.map((d, idx) => (
                  <tr key={d.id}>
                    <th>{idx + 1}</th>
                    <td>{format(new Date(d.date), "dd/MM/yyyy")}</td>
                    <td>{d.hours}</td>
                    <td>{d.rate}</td>
                    <td>{d.isPaid ? "Paid" : "Unpaid"}</td>
                    <td>{d.hours * d.rate}</td>
                    <td>{d.description}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => showUpdateModal(d)}
                        >
                          <MdOutlineEdit />
                        </button>
                        <button
                          className="btn btn-error btn-sm"
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
            <div className="container mx-auto py-4">
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
    `/api/tasks?month=${ctx.query.month}&year=${ctx.query.year}`
  );
  const amount = res.data?.reduce((acc, item) => {
    return (acc += item.hours * item.rate);
  }, 0);
  const months = await getMonths();

  return {
    props: { data: res.data, totalAmount: amount, months: months.data },
  };
}
