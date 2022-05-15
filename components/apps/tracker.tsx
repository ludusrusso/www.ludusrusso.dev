import styled from "@emotion/styled";
import { forwardRef, useRef } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { useReactToPrint } from "react-to-print";

export const TrackerApp = () => {
  return (
    <>
      <TrackerForm />
    </>
  );
};

interface TrackerProps {
  habits: string[];
  name: string;
}

const Tracker = (props: TrackerProps) => {
  return (
    <div className="h-[148mm] w-[210mm] bg-stone-100 relative">
      <div className="h-10 text-sm py-2 px-5 italic text-stone-600 font-thin">
        Habit tracker di <span className="font-normal">{props.name}</span>
      </div>
      <TrackedStyled>
        <div className="grid place-content-end italic pr-2 text-[2.5mm]">
          {" "}
          abitudine{" "}
        </div>
        {Array.from(new Array(31)).map((_, idx) => (
          <div
            key={idx}
            className="grid place-content-center  italic text-md text-[2mm]"
          >
            {idx + 1}
          </div>
        ))}
        {Array.from(new Array(23)).map((_, row) => {
          return [
            <div
              key={`${row}-head`}
              className={
                row % 2 === 0
                  ? "bg-stone-200 border-r-[1px] border-solid border-stone-300 text-[2.5mm] grid place-content-end pr-2 text-xs text-stone-700 text-bold"
                  : "border-r-[1px] border-solid border-stone-300 text-[2.5mm] grid place-content-end pr-2 text-xs text-stone-700 text-bold"
              }
            >
              {props.habits[row] || ""}
            </div>,
            ...Array.from(new Array(31)).map((_, col) => (
              <div
                key={`${row}-${col}`}
                className={
                  row % 2 === 0
                    ? "bg-stone-200 border-l-[1px] border-solid border-stone-300"
                    : "border-l-[1px] border-solid border-stone-300"
                }
              ></div>
            )),
          ];
        })}
      </TrackedStyled>
      <div className="absolute bottom-0 text-xs text-stone-500 p-5">
        Designed by Ludovico Russo - https://ludusrusso.dev
      </div>
    </div>
  );
};

const TrackedStyled = styled.div`
  font-size: 10%;
  width: 100%;
  display: grid;
  grid-template-rows: repeat(24, 5mm);
  grid-template-columns: calc(210mm - 5 * 31mm - 8px) repeat(31, 5mm);
  padding: 4px;
`;

/* eslint-disable react/display-name */
const ToPrint = forwardRef<any, TrackerProps>((props, ref) => {
  return (
    <div ref={ref}>
      <Tracker {...props} />
      <Tracker {...props} />
    </div>
  );
});

interface FormData {
  name: string;
  habitsList: string;
}

const TrackerForm = () => {
  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <Form<FormData>
        onSubmit={handlePrint}
        initialValues={{}}
        render={({ handleSubmit, invalid }) => (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Il tuo nome
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="name"
                component="input"
                placeholder="Ludovico"
              />
            </div>

            <Field
              name="habitsList"
              render={({ input, meta }) => (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Abitudini
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="push-ups, scrittura"
                    {...input}
                  />
                  {
                    <span className="text-gray-700 text-sm">
                      Separale tramite una virgole
                    </span>
                  }
                </div>
              )}
            />
            <FormSpy
              render={({ values, valid }) => {
                if (!valid || !values?.name || !values?.habitsList) {
                  values = {
                    name: "",
                    habitsList: "",
                  };
                }
                const h = {
                  name: values?.name,
                  habits: (values?.habitsList as string)
                    ?.split(",")
                    .map((s) => s.trim()),
                };
                return (
                  <>
                    <div className="hidden">
                      <ToPrint {...h} ref={componentRef} />
                    </div>
                  </>
                );
              }}
            ></FormSpy>

            <button
              type="submit"
              disabled={invalid}
              className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Stampa il tuo Tracker
            </button>
          </form>
        )}
      />
    </div>
  );
};
