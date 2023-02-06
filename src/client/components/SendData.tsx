import * as React from 'react';

import { Box } from '@mui/material';
import DropzoneComponent from './DropzoneComponent';

class SendData extends React.Component {

	constructor(props: any) {
		super(props);
		this.state = {};
	}

	render() {
		return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width='100%'
                height='100%'
            >
				<DropzoneComponent />
			</Box>
		);
	}
}

export default SendData;
