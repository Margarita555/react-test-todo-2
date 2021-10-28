import photo from '../images/my-photo.jpg';
import {AppPhoto} from './Header/Header.module.css'

const MyPhoto = () => {
    return <img src={photo} className={AppPhoto} alt="it is me" />
}
export default MyPhoto;