export interface Color {
    colors:          ColorElement[];
    schemes:         any[];
    success:         boolean;
    colors_history:  ColorsHistory;
    messages:        any[];
    new_color:       string;
}

export interface ColorElement {
    timestamp: number;
    hex:       string;
    id:        number;
    tags:      Tag[];
}

export interface Tag {
    timestamp: number;
    id:        number;
    name:      string;
}

export interface ColorsHistory {
    bec3c3: Bec3C3[];
}

export interface Bec3C3 {
    d_count: number;
    id:      string;
    a_count: number;
    name:    string;
}

