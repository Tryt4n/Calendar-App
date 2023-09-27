import { useState } from "react";
// Custom Hooks
import { useCalendar } from "../../hooks/useCalendar";
// Components
import ModalHeader from "./layout/ModalHeader";
import ModalForm from "./layout/ModalForm";

export default function NewEventModal() {
  const { state } = useCalendar();
  const { isModalOpen } = state;

  const [isModalClosing, setIsModalClosing] = useState(false);

  return (
    <>
      {isModalOpen && (
        <article className={`modal${isModalClosing ? " closing" : ""}`}>
          <div
            className="overlay"
            role="presentation"
          ></div>
          <div className="modal-body">
            <ModalHeader setIsModalClosing={setIsModalClosing} />
            <ModalForm />
          </div>
        </article>
      )}
    </>
  );
}
