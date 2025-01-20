import { Button } from "@/components/ui/button";
import { LoginFormData } from "@/utils/types";
import {
  Box,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import LoginCover from "../assets/login-cover.svg";
import Logo from "../assets/YHN_Logo.jpg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionInput = motion(Input);
const MotionPasswordInput = motion(PasswordInput);
const MotionButton = motion(Button);
const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
    // Handle login logic here
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <MotionBox
        width="85%"
        height="85%"
        bg="white"
        borderRadius="xl"
        boxShadow="2xl"
        overflow="hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex height="100%">
          <MotionBox
            width="70%"
            height="100%"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src={LoginCover}
              alt="Login Image"
              objectFit="cover"
              width="100%"
              height="100%"
              css={{
                transform: "scaleX(-1)",
              }}
            />
          </MotionBox>
          <MotionFlex
            width="45%"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={8}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <VStack gap={6} align="stretch">
                <MotionBox
                  display="flex"
                  justifyContent="center"
                  width="100%"
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Image
                    src={Logo}
                    alt="Logo Image"
                    width={"50%"}
                    fit="cover"
                  />
                </MotionBox>
                <Heading
                  as="h1"
                  size="2xl"
                  fontWeight={"medium"}
                  color={"gray.700"}
                  textAlign="left"
                >
                  Login
                </Heading>

                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                  }}
                  render={({ field }) => (
                    <Box>
                      <Field label="Email">
                        <MotionInput
                          {...field}
                          placeholder="Enter your email"
                          type="email"
                          size="lg"
                          // isInvalid={!!errors.email}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                        />
                        {errors.email && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.email.message}
                          </Text>
                        )}
                      </Field>
                    </Box>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field }) => (
                    <Box>
                      <Field label="Password">
                        <MotionPasswordInput
                          {...field}
                          placeholder="Enter your password"
                          size="lg"
                          // isInvalid={!!errors.password}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        />
                        {errors.password && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.password.message}
                          </Text>
                        )}
                      </Field>
                    </Box>
                  )}
                />
                <MotionFlex
                  justifyContent="space-between"
                  alignItems="center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Checkbox variant={"outline"} colorPalette={"blue.500"}>
                    Remember me
                  </Checkbox>
                  <Text color="blue.600" cursor="pointer" fontSize="sm">
                    Forgot password?
                  </Text>
                </MotionFlex>
                <MotionButton
                  type="submit"
                  background={"blue.600"}
                  size="lg"
                  // loading={}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Login
                </MotionButton>
              </VStack>
            </form>
          </MotionFlex>
        </Flex>
      </MotionBox>
    </Flex>
  );
};

export default Login;
