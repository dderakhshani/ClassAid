

// Automatically generate from Business.Models

export interface StatsSerie {

    // NAME
    name: string;
    // VALUE
    value: number;
    itemStyle: any;
}


export interface NameValue {

    // NAME
    name: string;
    // VALUE
    value: number;
}

export interface AssessMeasure {

    title: string;
    shortTitle: string;
    value: number;
    color: string;
    bdColor: string;
    ionColor: string;
}


export const AssessMeasures: AssessMeasure[] = [
    { title: "ارزشیابی ثبت نشده", shortTitle: 'بدون داده', value: 0, color: "", bdColor: "", ionColor: "" },
    { title: "نیاز به تلاش", shortTitle: 'ن.ب.ت', value: 1, color: "", bdColor: "text-danger", ionColor: "danger" },
    { title: "قابل قبول", shortTitle: 'ق.ق', value: 2, color: "", bdColor: "text-warning", ionColor: "warning" },
    { title: "خوب", shortTitle: 'خ', value: 3, color: "", bdColor: "text-primary", ionColor: "secondary" },
    { title: "خیلی خوب", shortTitle: 'خ.خ', value: 4, color: "", bdColor: "text-success", ionColor: "success" }
]