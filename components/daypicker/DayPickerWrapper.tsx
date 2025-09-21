"use client";

import dynamic from "next/dynamic";

const DayPicker = dynamic(() => import("@/components/daypicker/DayPicker"), {
  ssr: false,
});

const DayPickerWrapper = ({ route }: { route: string }) => {
  return <DayPicker route={route} />;
};

export default DayPickerWrapper;
