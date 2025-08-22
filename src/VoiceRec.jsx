import { useState, useEffect, act } from "react";

export default function VoiceRec({ clr, updateCity }) {
    const [getText, setText] = useState("");
    const [active, setActive] = useState(false);


    function handleClick() {
        setActive(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.start();

        setTimeout(() => {
        }, 1000);

        recognition.onresult = (e) => {
            let transcript = e.results[0][0].transcript;
            // 1. Remove punctuation
            transcript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

            // 2. Trim and normalize spaces
            transcript = transcript.trim().replace(/\s+/g, " ");
            if (transcript != null || transcript != "") {
                setText(transcript);
            }
        };

        recognition.onerror = () => {
            setText("Error");
        };

        recognition.onend = () => {
            // optional: reset or leave as "Done"
            setTimeout(() => setActive(false), 1500);

        };
    }

    useEffect(() => {
        if (getText !== "") {
            updateCity(getText);
            setText(""); 
        }
    }, [getText, updateCity]);


    return (
        <>
            <button type="button" onClick={handleClick} >
                <span className="material-symbols-outlined sp1" style={active ? { color: "blue" } : { color: clr }}>mic</span>
            </button>
        </>
    );
}

