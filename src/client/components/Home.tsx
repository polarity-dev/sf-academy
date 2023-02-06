import * as React from 'react';

import { Box, Typography } from '@mui/material';

class Home extends React.Component {

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
                <Typography variant="h4" component="h1" gutterBottom>Pagina dell'intern! 👾</Typography>
                <Typography variant="h5" component="h3" gutterBottom>Seleziona la pagina dalla navbar</Typography>
            </Box>
        );
    }
}

export default Home;
