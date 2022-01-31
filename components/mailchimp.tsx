import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Form, Field } from "react-final-form";
import { z } from "zod";
import { zodValidate } from "admin/utils/zodValidation";

const url = process.env.NEXT_PUBLIC_MAILCHIMP_ACTION as string;

const validator = z.object({
  email: z.string().email(),
});

export const Mailchimp = ({ title }: { title: string }) => (
  <MailchimpSubscribe
    url={url}
    render={({ subscribe, status, message }) => (
      <div>
        <MailchimpForm
          error={status === "error" ? (message as string) : ""}
          submitting={status === "sending"}
          success={status === "success"}
          title={title}
          onSubmit={(formData) =>
            subscribe({
              EMAIL: formData.email,
            })
          }
        />
      </div>
    )}
  />
);

interface MailchimpFormProps {
  onSubmit: (data: z.TypeOf<typeof validator>) => void;
  error: string;
  submitting: boolean;
  success: boolean;
  title: string;
}

const MailchimpForm = ({
  onSubmit,
  error,
  submitting,
  success,
  title,
}: MailchimpFormProps) => {
  return (
    <Form
      onSubmit={onSubmit}
      validate={zodValidate(validator)}
      render={({ handleSubmit, invalid }) => (
        <div>
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
            <div className="py-10 px-6 bg-indigo-700 rounded-3xl sm:py-16 sm:px-12 lg:p-20 lg:flex lg:items-center">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  {title}
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-indigo-100">
                  Registrati alla newsletter per rimanere sempre aggiornato!
                </p>
              </div>
              {success ? (
                <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                  <p className="text-white font-bold text-2xl">
                    Grazie per esserti registrato
                  </p>
                </div>
              ) : (
                <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                  <form className="sm:flex" onSubmit={handleSubmit}>
                    <label htmlFor="email-address" className="sr-only">
                      La tua migliore email
                    </label>
                    <Field
                      component="input"
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white rounded-md"
                      placeholder="Enter your email"
                    />
                    {submitting ? (
                      <div className="mt-3 w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0 disabled:bg-indigo-50">
                        ...
                      </div>
                    ) : (
                      <button
                        disabled={invalid}
                        type="submit"
                        className="mt-3 w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0 disabled:bg-indigo-50"
                      >
                        Registrati
                      </button>
                    )}
                  </form>
                  <p className="mt-3 text-sm text-indigo-100">
                    Ci tengo alla tua privacy. Leggi di più sulla mia{" "}
                    <a
                      href="https://www.iubenda.com/privacy-policy/7981809"
                      target="_blank"
                      className="text-white font-medium underline"
                    >
                      Privacy Policy.
                    </a>
                  </p>
                  {error && (
                    <p
                      className="mt-3 text-sm text-indigo-100"
                      dangerouslySetInnerHTML={{ __html: error }}
                    ></p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
};
