import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from 'recharts';



export default function Chart({cData}) {
    const data = [
        // { hour: 0, temp: 27 },
    ];
    if (cData != undefined && cData != "") {
        for (let i = 0; i < cData.length; i++) {
            const newdata = cData[i];
            const dateObj = new Date(newdata.date_time);
            data.push({
                hour: dateObj.getHours(),
                temp: Math.round(newdata.temp),
            })
        }

        console.log(data)
    }

    return (
        <ResponsiveContainer width="100%" height={150}>
            <LineChart
                data={data}
                margin={{ top: 30, right: 40, bottom: 20, left: 0 }}
            >
                <XAxis
                    dataKey="hour"
                    tickFormatter={(value) => `${value}:00`}
                    axisLine={false}     // removes the X axis line
                    tickLine={false}     // removes the small tick lines
                    tick={false}         // To remove the values of axis
                />
                <YAxis
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `${value}°C`} // 🌡️ Format temperature
                    axisLine={false}     // removes the X axis line
                    tickLine={false}     // removes the small tick lines
                    tick={false}         // To remove the values of axis
                />
                <Tooltip
                    formatter={(value, name) =>
                        name === 'temp' ? [`${value}°C`, 'Temperature'] : [value, name]
                    }
                    labelFormatter={(label) => `${label}:00`}
                />
                <Line
                    type="natural"
                    dataKey="temp"
                    stroke="#3366ff"
                    strokeWidth={2}
                    dot={{ r: 5, fill: "#fff", stroke: "#3366ff" }}
                >
                    {/* Padding added using dy */}
                    <LabelList dataKey="hour" position="bottom" dy={10} formatter={(v) => `${v}:00`} />
                    <LabelList dataKey="temp" position="top" dy={-10} formatter={(v) => `${v}°C`} />
                </Line>
            </LineChart>
        </ResponsiveContainer>
    );
}
