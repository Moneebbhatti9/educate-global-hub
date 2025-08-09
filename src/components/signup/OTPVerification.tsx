import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, ArrowRight, RotateCcw } from "lucide-react";

interface OTPVerificationProps {
  onVerify: () => void;
}

const OTPVerification = ({ onVerify }: OTPVerificationProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsLoading(true);
      
      // Simulate verification (accept any 6-digit code)
      setTimeout(() => {
        setIsLoading(false);
        onVerify();
      }, 2000);
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    // Reset focus to first input
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Verify Your Email
        </h1>
        <p className="text-muted-foreground">
          We've sent a 6-digit verification code to your email address. Please enter it below to continue.
        </p>
      </div>

      {/* OTP Verification Form */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-center">Enter Verification Code</CardTitle>
          <CardDescription className="text-center">
            Check your email for the 6-digit code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OTP Input */}
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold border-2 focus:border-brand-primary"
              />
            ))}
          </div>

          {/* Timer & Resend */}
          <div className="text-center">
            {!canResend ? (
              <p className="text-sm text-muted-foreground">
                Didn't receive the code? You can resend in {timer}s
              </p>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                className="text-brand-primary border-brand-primary hover:bg-brand-primary/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resend Code
              </Button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleSubmit}
            variant="hero"
            size="lg"
            className="w-full"
            disabled={!isComplete || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                Verify & Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center text-sm text-muted-foreground">
            Having trouble? <span className="text-brand-primary hover:underline cursor-pointer">Contact support</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;