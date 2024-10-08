import HomePage from "./components/HomePage.jsx";
import Header from "./components/Header.jsx";
import {useState} from "react";
import FileDisplay from "./components/FileDisplay.jsx";

function App() {

    const [file, setFile] = useState(null);
    const [audioStream, setAudioStream] = useState(null);

    const isAudioAvailable = file || audioStream;

    function handleAudioReset(){
        setAudioStream(null);
        setFile(null)
    }

    return (
        <div className={"flex flex-col max-w-[1000px] mx-auto w-full"}>
            <section className={"min-h-screen flex flex-col "}>
                <Header/>
                {isAudioAvailable ? (
                    <FileDisplay file={file}
                                 audioStream={audioStream}
                                 handleAudioReset={handleAudioReset}/>
                ) : (<HomePage setFile={setFile} setAudioStream={setAudioStream} />)}
            </section>
        </div>
    )
}

export default App
