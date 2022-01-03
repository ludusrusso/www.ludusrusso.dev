import { useAuth } from "admin/auth/auth.provider";
import { LabeledTextField } from "admin/components/text-field";
import { authCli } from "admin/services/auth.service";
import { zodValidate } from "admin/utils/zodValidation";
import { BlogIcon } from "components/icon";
import { useCallback, useEffect, useState } from "react";
import { Form, FormSpy } from "react-final-form";
import { LoginSchema } from "trpc/auth.validations";
import Router from "next/router";

const LoginPage = () => {
  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto h-12 w-auto flex justify-center text-indigo-600">
            <BlogIcon />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accedi con il tuo account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

const LoginForm = () => {
  const [err, setErr] = useState<string>();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      Router.push("/admin");
    }
  }, [currentUser]);

  const onSubmit = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setErr(undefined);
      setIsLoading(true);
      try {
        await authCli.login(email, password);
      } catch (e) {
        setErr("invalid login");
        setIsLoading(false);
      }
    },
    [setErr, setIsLoading]
  );

  return (
    <Form<{ email: string; password: string }>
      initialValues={{ email: "", password: "" }}
      onSubmit={onSubmit}
      validate={zodValidate(LoginSchema)}
      render={({ handleSubmit }) => (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <LabeledTextField name="email" type="email" label="Email address" />
          </div>

          <div className="mt-1">
            <LabeledTextField
              label="Password"
              name="password"
              type="password"
            />
          </div>

          {err && (
            <div className="mt-1">
              <p className="text-red-500">{err}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center"></div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <FormSpy
              render={({ invalid }) => (
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-100"
                  disabled={invalid || isLoading}
                >
                  {isLoading ? "..." : "Sign in"}
                </button>
              )}
            ></FormSpy>
          </div>
        </form>
      )}
    ></Form>
  );
};
