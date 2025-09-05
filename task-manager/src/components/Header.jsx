import "../styles/Header.css";
import logo from "../assets/my-logo.png";

function Header(){
    return (
        <header className="header">
            <img src={logo} className="logo" alt="Logo" />
        </header>
    );
}
    export default Header;