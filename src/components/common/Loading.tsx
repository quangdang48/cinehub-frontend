import classNames from "classnames";
import type { CSSProperties, ElementType, ReactNode } from "react";
import Spinner from "./Spinner";

interface BaseLoadingProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  asElement?: ElementType;
  customLoader?: ReactNode;
  loading: boolean;
  spinnerClass?: string;
}

interface LoadingProps extends BaseLoadingProps {
  type?: "default" | "cover";
}

const DefaultLoading = (props: BaseLoadingProps) => {
  const {
    loading,
    children,
    spinnerClass,
    className,
    asElement: Component = "div",
    customLoader,
  } = props;

  return loading ? (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-yellow-500 font-bold tracking-wider animate-pulse">
          LOADING...
        </p>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
};

const CoveredLoading = (props: BaseLoadingProps) => {
  const {
    loading,
    children,
    spinnerClass,
    className,
    asElement: Component = "div",
    customLoader,
  } = props;

  return (
    <Component className={classNames(loading ? "relative" : "", className)}>
      {children}
      {loading && (
        <div className="w-full h-full bg-white dark:bg-gray-800 dark:bg-opacity-60 bg-opacity-50 absolute inset-0" />
      )}
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          {customLoader ? (
            <>{customLoader}</>
          ) : (
            <Spinner className={spinnerClass} size={40} />
          )}
        </div>
      )}
    </Component>
  );
};

const Loading = ({ type, ...rest }: LoadingProps) => {
  switch (type) {
    case "default":
      return <DefaultLoading {...rest} />;
    case "cover":
      return <CoveredLoading {...rest} />;
    default:
      return <DefaultLoading {...rest} />;
  }
};

Loading.defaultProps = {
  loading: false,
  type: "default",
  asElement: "div",
};

export default Loading;
