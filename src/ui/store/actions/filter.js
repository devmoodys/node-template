export const OPEN_FILTER_PANEL = "OPEN_FILTER_PANEL";
export const CLOSE_FILTER_PANEL = "CLOSE_FILTER_PANEL";

export function closeFilterPanel() {
  return { type: CLOSE_FILTER_PANEL };
}

export function openFilters() {
  return { type: OPEN_FILTER_PANEL };
}
