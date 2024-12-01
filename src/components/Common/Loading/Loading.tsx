
export const Loading = () => {
    return (
        <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div
                className="w-20 h-20 border-4 border-transparent text-indigo-600 text-4xl animate-spin flex items-center justify-center border-t-indigo-600 rounded-full"
            >
                <div
                className="w-16 h-16 border-4 border-transparent text-green-600 text-2xl animate-spin flex items-center justify-center border-t-green-600 rounded-full"
                ></div>
            </div>
        </div>
    );
}

