"use client";

import { useState } from "react";
import { businessLocation } from "../site-data";

const credentiallessFrameAttributes = { credentialless: "" } as Record<string, string>;

export function LocationMap() {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="location-map"
      data-latitude={businessLocation.latitude}
      data-longitude={businessLocation.longitude}
    >
      <div className="location-map-canvas">
        {visible ? (
          <iframe
            {...credentiallessFrameAttributes}
            src={businessLocation.mapEmbedUrl}
            title={`Karta till White Velvet, ${businessLocation.address}`}
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="location-map-gate">
            <span className="map-pin" aria-hidden="true"><i>WV</i></span>
            <div>
              <strong>{businessLocation.address}</strong>
              <span>{businessLocation.postalCity}</span>
            </div>
            <button className="button button-light" type="button" onClick={() => setVisible(true)}>
              Visa interaktiv karta
            </button>
            <small>Kartan hämtas från OpenStreetMap först när du väljer att visa den.</small>
          </div>
        )}
      </div>
      <div className="location-map-footer">
        <div>
          <span className="eyebrow">HITTA HIT</span>
          <strong>{businessLocation.address}, {businessLocation.postalCity}</strong>
        </div>
        <div className="location-map-actions">
          {visible && (
            <button className="text-link map-hide-button" type="button" onClick={() => setVisible(false)}>
              Dölj karta
            </button>
          )}
          <a className="text-link" href={businessLocation.directionsUrl} target="_blank" rel="noopener noreferrer">
            Öppna vägbeskrivning
          </a>
        </div>
      </div>
    </div>
  );
}
