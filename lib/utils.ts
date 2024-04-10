import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function convertISOToFormat(dateInput: Date | string) {
    return moment(dateInput).format("DD/MM/YYYY HH:mm")
}
