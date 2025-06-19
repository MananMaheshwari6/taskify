// import React from "react";

function PageNotFound() {
  return (
    <>
      <div className="flex h-screen items-center justify-center space-x-2 flex-col bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="text-2xl">404</div>
        <div className="text-xl font-semibold text-green-900">
          Page Not Found
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
