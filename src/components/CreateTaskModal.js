import React from "react";

export default function CreateTaskModal({ data, handleChangeForm, onCreate }) {
  const { project, date, hours, rate, description } = data;
  return (
    <dialog id="my_modal_3" className="modal">
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
              <span className="label-text">Date</span>
            </div>
            <input
              name="date"
              value={date}
              onChange={handleChangeForm}
              type="date"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Hours?</span>
            </div>
            <input
              name="hours"
              value={hours}
              onChange={handleChangeForm}
              type="number"
              max={24}
              min={0}
              placeholder="Type hours"
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
          Create
        </button>
      </div>
    </dialog>
  );
}
