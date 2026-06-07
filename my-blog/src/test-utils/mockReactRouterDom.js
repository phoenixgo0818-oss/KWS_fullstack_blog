import React from 'react';

export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const Routes = ({ children }) => <div>{children}</div>;
export const Route = () => null;
export const Link = ({ children, to }) => <a href={to}>{children}</a>;
export const useParams = () => ({});
