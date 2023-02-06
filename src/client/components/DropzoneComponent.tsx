import * as React from 'react';
import { useDropzone } from 'react-dropzone';

function DropzoneComponent() {

    const baseText = "Fai qui drag'n'drop del file da caricare, oppure clicca per selezionarlo";
    const [text, setText] = React.useState(baseText);

    const onDrop = React.useCallback(acceptedFiles => {

        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        fetch("/importDataFromFile", {
            method: "POST",
            body: formData
        })
            .then(response => { })
            .then(data => {
                setText("File caricato correttamente");
            }).then(() => {
                setTimeout(() => {
                    setText(baseText);
                }, 3000);
            })

    }, []);

    const {
        getRootProps,
        getInputProps,
    } = useDropzone({
        onDrop,
    });


    return (
        //si potrebbe aggiungere una gif con rotellina di caricamento
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div>{text}</div>
        </div>
    )
}

export default DropzoneComponent;