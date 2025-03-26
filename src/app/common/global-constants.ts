export class GlobalConstants {
    // الأيقونات الأساسية بدون لون (بالـ SVG كـ نص)
    private static readonly baseIcons = {
        access_point: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 20" width="25" height="20">
          <path fill="{color}"
            d="M2.117 7.926C4.813 5.34 8.469 3.75 12.5 3.75s7.688 1.59 10.383 4.176c.5.477 1.289.461 1.766-.035s.461-1.289-.035-1.766C21.473 3.105 17.203 1.25 12.5 1.25S3.527 3.105.383 6.121c-.496.481-.512 1.27-.035 1.77s1.27.516 1.766.035zM12.5 10c2.219 0 4.242.824 5.789 2.188.52.457 1.309.406 1.766-.109s.406-1.309-.109-1.766C17.961 8.563 15.352 7.5 12.5 7.5s-5.461 1.063-7.441 2.813c-.52.457-.566 1.246-.109 1.766s1.246.566 1.766.109A8.7 8.7 0 0 1 12.505 10zm2.5 6.25a2.5 2.5 0 1 0-5 0 2.5 2.5 0 1 0 5 0" />
        </svg>`,
        customer: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.5 20" width="17.5" height="20">
          <path fill="{color}"
            d="M8.75 10a5 5 0 1 0 0-10 5 5 0 1 0 0 10m-1.785 1.875A6.963 6.963 0 0 0 0 18.84 1.16 1.16 0 0 0 1.16 20h15.18a1.16 1.16 0 0 0 1.16-1.16 6.963 6.963 0 0 0-6.965-6.965z" />
        </svg>`,
        switch: `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
          <path fill="{color}"
            d="M5.625 10.313h18.75a.94.94 0 0 1 .938.938v7.5a.94.94 0 0 1-.938.938H5.625a.94.94 0 0 1-.938-.938v-7.5a.94.94 0 0 1 .938-.938" />
          <path fill="#fff"
            d="M10.782 15a1.41 1.41 0 0 1-1.407 1.407A1.41 1.41 0 0 1 7.97 15a1.407 1.407 0 0 1 2.813 0m5.624 0A1.41 1.41 0 0 1 15 16.407 1.41 1.41 0 0 1 13.595 15a1.407 1.407 0 0 1 2.813 0m5.624 0a1.41 1.41 0 0 1-1.407 1.407A1.41 1.41 0 0 1 19.22 15a1.407 1.407 0 0 1 2.813 0" />
        </svg>`,
    };

    /**
     * ميثود للحصول على SVG مع لون معين.
     * @param deviceType - نوع الجهاز: access_point | customer | switch
     * @param color - اللون المطلوب للأيقونة (مثلاً: 'red', 'green', 'blue')
     * @returns نص الـ SVG مع اللون
     */
    public static getIcon(deviceType: 'access_point' | 'customer' | 'switch', color: string): string {
        const baseIcon = this.baseIcons[deviceType];
        if (!baseIcon) {
            throw new Error(`Invalid device type: ${deviceType}`);
        }

        return baseIcon.replace('{color}', color);
    }
}
