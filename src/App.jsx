import ClaimForm from "./components/ClaimForm";

export default function App() {


  return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800">
              <ClaimForm />
            </div>
          </main>
        </div>
  );
}
