const Loader = () => {
    return (
        <div className="cover-loading">
            <div
                className="spinner-border text-primary mt-5 me-4"
                role="status"
                style={{width: "8rem", height: "8rem"}}
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Loader