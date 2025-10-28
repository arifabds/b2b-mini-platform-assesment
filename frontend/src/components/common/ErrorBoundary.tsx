import React from 'react';

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-6">
                    <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Oops! Something went wrong.</h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">An unexpected error occurred.</p>
                    <button
                        onClick={this.handleReload}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
