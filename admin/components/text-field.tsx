import { Field } from "react-final-form";

interface LabeledTextFieldProps {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

export const LabeledTextField = (props: LabeledTextFieldProps) => (
  <Field
    {...props}
    render={({ meta, input }) => (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
        <input
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...input}
          {...props}
        />
        {meta.touched && meta.error && (
          <p className="text-sm text-red-500 text-right mt-1"> {meta.error}</p>
        )}
      </div>
    )}
  />
);
