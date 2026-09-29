import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import hexToRgba from "../../utils/hex-to-rgba";
import ChartContainer from "./chart-container";

type Key<K extends string> = {
  id: K;
  color: string;
};

type IStackedAreaChartData<K extends string> = {
  name: string;
} & Record<K, number>;

interface IStackedAreaChartProps<K extends string> {
  keys: readonly Key<K>[];
  data: IStackedAreaChartData<K>[];
  translations?: Record<K, string>;
}

const StackedAreaChart = <K extends string>({
  keys,
  data,
  translations,
}: IStackedAreaChartProps<K>) => {
  return (
    <ChartContainer type="stacked-area">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            left: -20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9d9baf" }} />
          <YAxis tick={{ fontSize: 12, fill: "#9d9baf" }} />
          <Tooltip
            contentStyle={{
              fontSize: "0.875rem",
              backgroundColor: "#212121",
              borderRadius: "0.625rem",
              border: "1px solid #767587",
            }}
            formatter={(value: number, name: string) => [
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value),
              translations?.[name as K] ?? name,
            ]}
          />
          {keys.map((key) => {
            return (
              <Area
                key={key.id}
                type="monotone"
                dataKey={key.id}
                stackId="1"
                stroke={key.color}
                fill={hexToRgba(key.color, 0.2)}
              />
            );
          })}
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              fontSize: "0.75rem",
              lineHeight: "1.8",
              marginLeft: 20,
            }}
            formatter={(value: string) => translations?.[value as K] ?? value}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default StackedAreaChart;
