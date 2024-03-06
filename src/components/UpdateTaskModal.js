import { format, intervalToDuration } from "date-fns";

export default function UpdateTaskModal({ data, handleChangeForm, onCreate }) {
  const { project, from, to, rate, description } = data || {
    project: "Susu",
    from: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    to: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    rate: 8,
    description: "",
  };
  const duration = intervalToDuration({
    start: new Date(from),
    end: new Date(to),
  });
  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Create new report!</h3>
        <div className="flex flex-col gap-4 my-4">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Project name?</span>
            </div>
            <input
              name="project"
              value={project}
              onChange={handleChangeForm}
              placeholder="Type project name"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">From</span>
            </div>
            <input
              name="from"
              value={from}
              onChange={handleChangeForm}
              type="datetime-local"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">To</span>
            </div>
            <input
              name="to"
              value={to}
              onChange={handleChangeForm}
              type="datetime-local"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Duration</span>
            </div>
            <input
              disabled
              value={`${duration.hours}:${duration.minutes}`}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Rate?</span>
            </div>
            <input
              name="rate"
              value={rate}
              onChange={handleChangeForm}
              type="number"
              min={0}
              placeholder="Type rate"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Description / Task name?</span>
            </div>
            <textarea
              name="description"
              value={description}
              onChange={handleChangeForm}
              type="text"
              placeholder="Type description"
              className="textarea textarea-bordered"
            />
          </label>
        </div>
        <button className="btn btn-warning" onClick={onCreate}>
          Update
        </button>
      </div>
    </dialog>
  );
}
