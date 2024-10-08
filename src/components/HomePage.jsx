import React, {useState, useEffect, useRef} from 'react';

const HomePage = (props) => {
    const {setFile, setAudioStream} = props;

    const [recordingStatus, setRecordingStatus] = useState('inactive');
    const [audioChunks, setAudioChunks] = useState([]);
    const [duration, setDuration] = useState(0);

    const mediaRecorder = useRef(null);

    const mimeType = 'audio/webm';

    async function startRecording() {
        let tempStream

        console.log("startRecording");

        try {
            const streamData = await navigator.mediaDevices.getUserMedia(
                {
                    video: false,
                    audio: true
                }
            );
            tempStream = streamData

        } catch (error) {
            console.log(error.message)
            return
        }

        setRecordingStatus('recording')

        //create new media recorder instance using the stream
        const media = new MediaRecorder(tempStream, { type:mimeType })
        mediaRecorder.current = media

        mediaRecorder.current.start()
        let localAudioChunks = []
        mediaRecorder.current.ondataavailable = (event) => {
            if(typeof event.data === 'undefined'){ return }
            if(event.data.size === 0){ return }
            localAudioChunks.push(event.data)
        }
        setAudioChunks(localAudioChunks)
    }

    async function stopRecording() {
        setRecordingStatus('inactive')
        console.log('Stop recording')

        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks,{ type: mimeType })
            setAudioStream(audioBlob)
            setAudioChunks([])
            setDuration(0)
        }
    }

    useEffect(() => {
        if(recordingStatus==='inactive') {return}
        const interval = setInterval(() => {
            setDuration(curr => curr + 1)
        }, 1000)

        return () => clearInterval(interval)
    })


    return (
        <main className={"flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20"}>
            <h1 className={"font-semibold text-5xl sm:text-6xl md:text-7xl"}>Jee<span
                className={"text-blue-400 bold"}>txt</span></h1>
            <h3 className={"font-medium md:text-lg"}> Record <span
                className={"text-blue-400"}><i className="fa-solid fa-arrow-right"></i> </span>Transcribe <span
                className={"text-blue-400"}><i className="fa-solid fa-arrow-right"></i></span> Translate</h3>
            <button
                onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
                className={"flex specialBtn px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-80 max-w-full my-4 "}>
                <p className={"text-blue-400"}>{recordingStatus === 'inactive' ? 'Record' : `Stop recording`}</p>
                <div className={"flex items-center gap-2"}>
                    {duration!==0 && (
                        <p className={"text-sm "}>{duration}s</p>
                    )}
                    <i className={"fa-solid duration-200 fa-microphone " + (recordingStatus === 'recording' ? 'text-rose-300' : '')}></i>
                </div>
            </button>
            <p className={"text-base"}>Or <label
                className={"text-blue-400 cursor-pointer hover:text-blue-600 duration-200 underline"}>Upload
                <input onChange={(e) => {
                    const tempFile = e.target.files[0];
                    setFile(tempFile);
                }} className={"hidden"} type={"file"} accept={".mp3,.wave"}/></label> a mp3 file</p>
            <p className={"italic text-slate-500"}> KeshriXLabs Flavor: Enjoy This Gem for Free—Forever! </p>
        </main>
    );
};

export default HomePage;