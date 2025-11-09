/**
 * Type definitions for Routes and Stops
 */

export interface Route {
  name: string;
  stops: string[];
}

export interface RouteWithStop {
  routeName: string;
  stopName: string;
}

export interface SelectedStop {
  stopName: string;
  routeName: string;
}