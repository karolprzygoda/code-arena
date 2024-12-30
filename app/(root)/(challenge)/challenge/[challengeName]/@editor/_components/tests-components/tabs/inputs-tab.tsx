type InputsTabProps = {
  test: PrismaJson.TestCasesType[number];
};

const InputsTab = ({ test }: InputsTabProps) => {
  return (
    <div className={"flex flex-col gap-2 p-4 font-semibold"}>
      {test.inputs.map((input) => (
        <div key={input.name}>
          {input.name + ": " + JSON.stringify(input.value)}
        </div>
      ))}
    </div>
  );
};

export default InputsTab;
