import { Button, ButtonProps } from 'antd';
import React from 'react';

interface AppButtonProps extends ButtonProps {
    children: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({ children, ...props }) => {
    return (
        <Button {...props}>
            {children}
        </Button>
    );
};
