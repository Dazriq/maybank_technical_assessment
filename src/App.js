import { Box, Flex, Input } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";

const App = () => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Initialize Google Maps when the script is loaded
    script.onload = () => {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 3.1473910391837303, lng: 101.69953520006527 },
          zoom: 12,
        });

        // Check if autocomplete is available
        if (!window.google.maps.places) {
          setError("Autocomplete is not available. Please try again later.");
          return;
        }

        // Create a search box and link it to the input element
        const searchBox = new window.google.maps.places.SearchBox(
          searchInputRef.current
        );

        // Listen for the event triggered when the user selects a prediction from the search box
        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces();

          if (places.length === 0) {
            return;
          }

          // Clear any existing marker
          if (map.marker) {
            map.marker.setMap(null);
          }

          // Get the first place from the search results
          const place = places[0];

          // Create a marker for the selected place
          map.marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map,
            title: place.name,
          });

          // Zoom to the selected place
          map.setZoom(15);
          map.setCenter(place.geometry.location);
        });
      } catch (error) {
        setError("Error loading Google Maps");
      }
    };

    // Clean up the Google Maps script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Flex position="relative" flexDirection="column" alignItems="center" h="100vh" w="100vw">
      {error ? (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          p={4}
          bgColor="red.500"
          color="white"
          fontWeight="bold"
          textAlign="center"
        >
          {error}
        </Box>
      ) : null}
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        <div
          ref={mapRef}
          style={{
            width: "100vw",
            height: "100vh",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        />
      </Box>
      <Box p={4} borderRadius="lg" m={4} bgColor="white" shadow="base" minW="container.md" zIndex="1">
        <Input type="text" placeholder="Search" ref={searchInputRef} />
      </Box>
    </Flex>
  );
};

export default App;
