const wells = [
    {
        id: "W-101",
        type: "historical",
        lat: 27.4820,
        lng: 94.8900,
        depth: 4120,
        formation: "Girujan Formation",

        events: [
            {
                type: "Mud Loss",
                depth: 3240,
                severity: "High"
            },
            {
                type: "Stuck Pipe",
                depth: 3510,
                severity: "Medium"
            }
        ]
    },

    {
        id: "W-102",
        type: "historical",
        lat: 27.5000,
        lng: 94.9200,
        depth: 3980,
        formation: "Barail Formation",

        events: [
            {
                type: "Kick",
                depth: 2980,
                severity: "High"
            }
        ]
    },

    {
        id: "W-103",
        type: "present",
        lat: 27.4600,
        lng: 94.9400,
        depth: 3650,
        formation: "Girujan Formation",

        events: []
    },

    {
        id: "W-104",
        type: "historical",
        lat: 27.4400,
        lng: 94.9000,
        depth: 4300,
        formation: "Girujan Formation",

        events: [
            {
                type: "Mud Loss",
                depth: 3190,
                severity: "High"
            }
        ]
    },

    {
        id: "W-105",
        type: "present",
        lat: 27.4900,
        lng: 94.9500,
        depth: 3820,
        formation: "Barail Formation",

        events: []
    },

    {
        id: "W-106",
        type: "historical",
        lat: 27.4200,
        lng: 94.9300,
        depth: 4050,
        formation: "Girujan Formation",

        events: [
            {
                type: "Cementing Issue",
                depth: 3670,
                severity: "Medium"
            }
        ]
    },

    {
        id: "W-107",
        type: "historical",
        lat: 27.5200,
        lng: 94.8800,
        depth: 4500,
        formation: "Barail Formation",

        events: [
            {
                type: "Stuck Pipe",
                depth: 3600,
                severity: "High"
            }
        ]
    }
];


let currentLat = 27.4728;
let currentLng = 94.9123;


const map = L.map("map").setView(
    [currentLat, currentLng],
    12
);


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


let currentMarker = null;
let radiusCircle = null;


function createCurrentWell(lat, lng) {

    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    if (radiusCircle) {
        map.removeLayer(radiusCircle);
    }

    currentMarker = L.circleMarker(
        [lat, lng],
        {
            radius: 9,
            color: "#111",
            fillColor: "#111",
            fillOpacity: 1
        }
    ).addTo(map);

    currentMarker.bindPopup(
        "<b>Current Well</b><br>" +
        "Latitude: " + lat.toFixed(4) + "<br>" +
        "Longitude: " + lng.toFixed(4)
    );

    const radius = Number(
        document.getElementById("radius").value
    );

    radiusCircle = L.circle(
        [lat, lng],
        {
            radius: radius * 1000,
            color: "#1976d2",
            fillOpacity: 0.08
        }
    ).addTo(map);
}


function createWellIcon(type) {

    if (type === "historical") {

        return L.divIcon({
            className: "",
            html: `
                <div style="
                    width: 0;
                    height: 0;
                    border-left: 9px solid transparent;
                    border-right: 9px solid transparent;
                    border-bottom: 18px solid #e53935;
                "></div>
            `,
            iconSize: [18, 18],
            iconAnchor: [9, 18]
        });
    }

    return L.divIcon({
        className: "",

        html: `
            <div style="
                width: 16px;
                height: 16px;
                background: #1976d2;
                border: 2px solid white;
                box-shadow: 0 0 3px #555;
            "></div>
        `,

        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
}


let wellMarkers = [];


function showNearbyWells(lat, lng) {

    // Remove old markers
    wellMarkers.forEach(function(marker) {
        map.removeLayer(marker);
    });

    wellMarkers = [];

    const radius = Number(
        document.getElementById("radius").value
    );

    wells.forEach(function(well) {

        const distance = map.distance(
            [lat, lng],
            [well.lat, well.lng]
        );

        const distanceKm = distance / 1000;

        if (distanceKm <= radius) {

            const marker = L.marker(
                [well.lat, well.lng],
                {
                    icon: createWellIcon(well.type)
                }
            ).addTo(map);

            marker.on("click", function() {

                showWellInformation(
                    well,
                    distanceKm
                );

            });

            wellMarkers.push(marker);
        }
    });
}


function showWellInformation(well, distance) {

    const panel =
        document.getElementById("wellInfo");

    const content =
        document.getElementById("wellContent");

    let eventsHTML = "";


    if (well.events.length === 0) {

        eventsHTML =
            "<p>No major historical events recorded.</p>";

    } else {

        well.events.forEach(function(event) {

            eventsHTML += `
                <div class="event">

                    <strong>${event.type}</strong>

                    <br>

                    Depth:
                    ${event.depth} m

                    <br>

                    Severity:
                    ${event.severity}

                </div>
            `;
        });
    }


    content.innerHTML = `

        <h2>${well.id}</h2>

        <p>
            <strong>Type:</strong>
            ${
                well.type === "historical"
                    ? "Historical Well"
                    : "Present Well"
            }
        </p>

        <p>
            <strong>Distance:</strong>
            ${distance.toFixed(2)} km
        </p>

        <p>
            <strong>Latitude:</strong>
            ${well.lat}
        </p>

        <p>
            <strong>Longitude:</strong>
            ${well.lng}
        </p>

        <p>
            <strong>Total Depth:</strong>
            ${well.depth} m
        </p>

        <p>
            <strong>Formation:</strong>
            ${well.formation}
        </p>

        <hr>

        <h3>Historical Events</h3>

        ${eventsHTML}

    `;

    panel.classList.remove("hidden");
}


document
    .getElementById("searchBtn")
    .addEventListener("click", function() {

        const lat = Number(
            document.getElementById("latitude").value
        );

        const lng = Number(
            document.getElementById("longitude").value
        );

        const radius = Number(
            document.getElementById("radius").value
        );


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng) ||
            !Number.isFinite(radius) ||
            radius <= 0 ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
        ) {
            alert("Please enter valid coordinates and radius.");
            return;
        }


        currentLat = lat;
        currentLng = lng;


        map.setView(
            [lat, lng],
            12
        );


        createCurrentWell(
            lat,
            lng
        );


        showNearbyWells(
            lat,
            lng
        );
    });


map.on("click", function(e) {

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;


    document.getElementById("latitude").value =
        lat.toFixed(4);

    document.getElementById("longitude").value =
        lng.toFixed(4);


    currentLat = lat;
    currentLng = lng;


    createCurrentWell(
        lat,
        lng
    );


    showNearbyWells(
        lat,
        lng
    );
});


document
    .getElementById("closeInfo")
    .addEventListener("click", function() {

        document
            .getElementById("wellInfo")
            .classList.add("hidden");
    });


document
    .getElementById("mapLocationBtn")
    .addEventListener("click", function() {

        createCurrentWell(
            currentLat,
            currentLng
        );

        showNearbyWells(
            currentLat,
            currentLng
        );
    });


createCurrentWell(
    currentLat,
    currentLng
);


showNearbyWells(
    currentLat,
    currentLng
);