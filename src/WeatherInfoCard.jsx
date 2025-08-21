import '@fontsource/roboto/400.css';
import './WeatherInfoCard.css'

export default function WeatherInfoCard() {

    return (
        <div className="card flex" style={{ fontFamily: 'roboto' }}>
            <div className="desciption flex">
                <div className='flex'>
                    <span class="material-symbols-outlined">air</span>
                    <h2>17</h2>
                </div>
                <div className='flex'>
                    <p style={{ marginTop: "-.2rem" }}>Wind Speed</p>
                    <p style={{ marginTop: "-1.5rem" }}>Km/h</p>
                </div>
            </div>
        </div>
    );
}