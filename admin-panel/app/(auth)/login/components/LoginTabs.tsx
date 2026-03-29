import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { motion } from "framer-motion";
import { itemVariants } from "../constants/animation";

type Props = {
  setLoginMethod: (value: string) => void;
};

export default function LoginTabs({ setLoginMethod }: Props) {
  return (
    <motion.div variants={itemVariants}>
      <Tabs
        defaultValue="email"
        className="w-full"
        onValueChange={setLoginMethod}
      >
        <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50 p-1">
          <TabsTrigger
            value="email"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Email
          </TabsTrigger>
          <TabsTrigger
            value="phone"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Điện thoại
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
}
