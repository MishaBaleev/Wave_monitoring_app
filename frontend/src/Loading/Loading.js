import "./Loading.scss";

const Loading = () => {
    return <div className="loading_cmp">
        <div className="spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
        </div>
        <p>Загрузка...</p>
    </div>
}
export default Loading