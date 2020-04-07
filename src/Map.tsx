import React from 'react';
import { MapOptions } from 'ol/PluggableMap';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapEvent from 'ol/MapEvent';
import olMap from 'ol/Map';
import { ObjectEvent } from 'ol/Object';
import RenderEvent from 'ol/render/Event';

import { CurrentMapContext } from './CurrentMapContext';
import { MapContext } from './MapContext';

export interface MapEvents {
    onchange?: (evt: Event) => void;
    onchangeLayerGroup?: (evt: ObjectEvent) => void;
    onchangeSize?: (evt: ObjectEvent) => void;
    onchangeTarget?: (evt: ObjectEvent) => void;
    onchangeView?: (evt: ObjectEvent) => void;
    onclick?: (evt: MapBrowserEvent) => void;
    ondblclick?: (evt: MapBrowserEvent) => void;
    onmovestart?: (evt: MapEvent) => void;
    onmoveend?: (evt: MapEvent) => void;
    onpointerdrag?: (evt: MapBrowserEvent) => void;
    onpointermove?: (evt: MapBrowserEvent) => void;
    onpostcompose?: (evt: RenderEvent) => void;
    onpostrender?: (evt: MapEvent) => void;
    onprecompose?: (evt: RenderEvent) => void;
    onpropertychange?: (evt: ObjectEvent) => void;
    onrendercomplete?: (evt: RenderEvent) => void;
    onsingleclick?: (evt: MapBrowserEvent) => void;
}

export interface MapProps extends MapEvents, React.HTMLAttributes<HTMLDivElement> {
    mapId?: string;
    children?: React.ReactNode;
    initialMapOptions: Omit<MapOptions, 'target'>;
}

export const OlMap = (props: MapProps) => {
    const {
        mapId,
        children,
        initialMapOptions,

        onchange,
        onchangeLayerGroup,
        onchangeTarget,
        onchangeView,
        onclick,
        ondblclick,
        onmovestart,
        onmoveend,
        onpointerdrag,
        onpointermove,
        onpostcompose,
        onpostrender,
        onprecompose,
        onpropertychange,
        onrendercomplete,
        onsingleclick,

        ...divProps
    } = props;

    const mapElementRef = React.useRef<HTMLDivElement>(null);
    
    const mapObj = new olMap({
        controls: initialMapOptions.controls,
        interactions: initialMapOptions.interactions,
        layers: initialMapOptions.layers,
        view: initialMapOptions.view,
        overlays: initialMapOptions.overlays,
    });

    const mapContext = React.useContext(MapContext);
    if (mapId && mapContext) {
        mapContext.registerMap(mapObj, mapId);
    }

    React.useEffect(() => {
        onchange && mapObj.on('change', onchange);
        onchangeLayerGroup && mapObj.on('change:layerGroup', onchangeLayerGroup);
        onchangeTarget && mapObj.on('change:target', onchangeTarget);
        onchangeView && mapObj.on('change:view', onchangeView);
        onclick && mapObj.on('click', onclick);
        ondblclick && mapObj.on('dblclick', ondblclick);
        onmovestart && mapObj.on('movestart', onmovestart);
        onmoveend && mapObj.on('moveend', onmoveend);
        onpointerdrag && mapObj.on('pointerdrag', onpointerdrag);
        onpointermove && mapObj.on('pointermove', onpointermove);
        onpostcompose && mapObj.on('postcompose', onpostcompose);
        onpostrender && mapObj.on('postrender', onpostrender);
        onprecompose && mapObj.on('precompose', onprecompose);
        onpropertychange && mapObj.on('propertychange', onpropertychange);
        onrendercomplete && mapObj.on('rendercomplete', onrendercomplete);
        onsingleclick && mapObj.on('singleclick', onsingleclick);

        mapObj.render();
        
        if (mapElementRef.current) {
            mapObj.setTarget(mapElementRef.current);
        }

        return function cleanup() {
            mapObj.setTarget(undefined);
        };
    }, [initialMapProps, mapElementRef]);
    
    return (
        <CurrentMapContext.Provider value={{ map: mapObj }}>
            <div ref={mapElementRef} {...divProps}>
                {children}
            </div>
        </CurrentMapContext.Provider>
    );
};
