import "./resetCSS.css";
import "./App.css";

import { PROJECT_NAME } from "../constants.ts";
import MazeControlTabs from "./maze-control/MazeControlTabs.tsx";
import { MazeCanvasImproved } from "./maze-canvas/MazeCanvas.tsx";

const classNames = {
  mainContainer: "container mx-auto px-4 flex",
  logoText: "text-3xl font-bold underline",
};

function App() {
  return (
    <div className="bg-gray-50">
      <header className="mb-4">
        <h1 className={classNames.logoText}>{PROJECT_NAME}</h1>
      </header>
      <main className={classNames.mainContainer}>
        <div className="left-panel">
          <MazeCanvasImproved />
        </div>
        <div className="right-panel">
          <MazeControlTabs />
        </div>
      </main>
    </div>
  );
}

export default App;
