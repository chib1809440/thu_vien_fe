import { GoogleMap, Marker, Polyline, withGoogleMap, withScriptjs } from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";

const Map = () => {
    const options = { closeBoxURL: '', enableEventPropagation: false };

    const optionsPolyline = {
        strokeColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#085daa',
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 30000,
        zIndex: 1
    };
    const positions = [{
        lat: 10.0075876, lng: 105.7922801, label: "Song phương"
    }, {
        lat: 10.0114231, lng: 105.789109, label: "cửu long"
    }, {
        lat: 10.0094999, lng: 105.7862986, label: "GD"
    }]
    return (
        <div>
            {/* <GoogleMap
                defaultZoom={15}
                defaultCenter={{ lat: 10.0094999, lng: 105.7862986 }}
            >
                {
                    positions && positions.map((position, index) =>
                        <Marker
                            position={new window.google.maps.LatLng(position)}
                        >
                            <InfoBox
                                options={options}
                            >
                                <>
                                    <div style={{ backgroundColor: 'green', color: 'white', borderRadius: '1em', padding: '0.2em' }}>
                                        {position.label}
                                    </div>
                                </>
                            </InfoBox>

                        </Marker>
                    )
                }
                <Polyline
                    path={positions}
                    options={optionsPolyline}
                />

            </GoogleMap> */}
        </div>
    );
}

export default withScriptjs(withGoogleMap(Map));

