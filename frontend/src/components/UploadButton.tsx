import React from "react";
import { Button } from "react-bootstrap";
import config from "../config";

interface IUploadButtonProps {
    onUploadStart?: () => void;
    onUploadSuccess: () => void
}

class UploadButton extends React.Component<IUploadButtonProps> {
    inputRef;

    constructor(props: IUploadButtonProps) {
        super(props);
        this.inputRef = React.createRef<HTMLInputElement>();

        this.handleUpload = this.handleUpload.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleUpload() {
        this.props.onUploadStart && this.props.onUploadStart();
        if (this.inputRef.current?.files) {
            const data = new FormData();
            data.append("file", this.inputRef.current.files[0]);

            fetch(`${config.api_path}/importDataFromFile`, {method: 'POST', body: data})
                .then((res: Response) => {
                    this.props.onUploadSuccess();
                })
                .catch((err) => {
                    alert("There was an error uploading file.");
                    console.error(err);
                })
                .finally(() => {
                    this.inputRef.current && (this.inputRef.current.value = "");
                });
        }
    }

    handleClick() {
        this.inputRef.current?.click();
    }

    render() {
        return (
            <>
                <input ref={this.inputRef} type="file" className="d-none" onChange={this.handleUpload} />
                <Button onClick={this.handleClick}>Upload</Button>
            </>
        );
    }
}

export default UploadButton;
