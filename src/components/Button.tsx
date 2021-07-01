import { Box, Typography } from "@material-ui/core";
import React, { ReactNode } from "react";

import AssignmentIcon from '@material-ui/icons/Assignment';

interface ButtonProps {
    right_icon?: ReactNode;
    title: string;
    disabled?: boolean;
    onClick?(): void
}

const Button: React.FC<ButtonProps> = ({ right_icon, title, disabled, onClick }) => {
    return (
        <Box sx={{display: 'flex', mt: 2}}>
            <div onClick={onClick}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingX: 4,
                    paddingY: 1,
                    borderRadius: 3,
                    backgroundColor: '#00b8fa',
                    cursor: 'pointer' ,
                    color: '#fff',
                    transition: 'all .2s',
                    ':hover': {
                        backgroundColor: '#fff',
                        color: '#00b8fa',
                        borderWidth: 1,
                        borderColor:  '#00b8fa'
                    }
                }}
            >
                <Typography >{title}</Typography>
                {right_icon && right_icon}
            </Box>
            </div>
        </Box>
    );
};

export default Button;
