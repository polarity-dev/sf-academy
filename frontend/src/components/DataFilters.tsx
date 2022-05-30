import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";

export interface IDataFilters {
    limit: string | null;
    from: Date | null;
}

interface IDataFiltersProps {
    onChange?: (state: IDataFilters) => void
}

class DataFilters extends React.Component<IDataFiltersProps, IDataFilters> {
    constructor(props: IDataFiltersProps) {
        super(props);

        this.state = {
            limit: null,
            from: null
        };

        this.handleLimitChange = this.handleLimitChange.bind(this);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.callOnChange = this.callOnChange.bind(this);
    }

    handleLimitChange(value: string) {
        const limit = value.trim().length ? value.trim() : null;
        this.setState({limit}, this.callOnChange);
    }

    handleFromChange(date: Date) {
        this.setState({from: date}, this.callOnChange);
    }

    callOnChange() {
        this.props.onChange && this.props.onChange(this.state);
    }

    render() {
        return (
            <>
                <Form.Control
                    className="w-auto ms-auto"
                    type="number"
                    onChange={e => this.handleLimitChange(e.target.value)}
                    placeholder="Limit results"
                />
                <div className="w-auto">
                    <DatePicker
                        className="form-control w-auto"
                        selected={this.state.from}
                        onChange={this.handleFromChange}
                        placeholderText="From date"
                    />
                </div>
            </>
        );
    }
}

export default DataFilters;