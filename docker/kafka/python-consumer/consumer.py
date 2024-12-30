from kafka import KafkaConsumer, KafkaProducer
import json
import traceback
from multiprocessing import Process, Manager
import builtins


def create_sandbox_globals():
    safe_builtins = dict(vars(builtins))

    del safe_builtins["open"]
    del safe_builtins["eval"]
    del safe_builtins["exec"]
    del safe_builtins["compile"]
    del safe_builtins["__import__"]
    del safe_builtins["getattr"]
    del safe_builtins["setattr"]
    del safe_builtins["delattr"]
    del safe_builtins["globals"]
    del safe_builtins["locals"]

    return {"__builtins__": safe_builtins, "solution": None}


def execute_in_sandbox(code, inputs, return_dict):

    logs = []

    def custom_print(*args, **kwargs):
            message = " ".join(map(str, args))
            logs.append(message)


    sandbox_globals = create_sandbox_globals()

    try:
        # Kompilacja kodu użytkownika
        exec(code, sandbox_globals)

        # Sprawdź, czy funkcja użytkownika "solution" istnieje
        if not callable(sandbox_globals.get("solution")):
            raise ValueError("User code must define a callable function 'solution'.")

        # Przygotuj wejścia testowe
        test_inputs = [inp["value"] for inp in inputs]

        # Wywołaj funkcję użytkownika z wejściami testowymi
        actual_output = sandbox_globals["solution"](*test_inputs)

        # Zapisz wyniki
        return_dict["actual_output"] = actual_output
        return_dict["logs"] = logs
        return_dict["error"] = None
    except Exception as e:
        # Obsługa błędów
        return_dict["actual_output"] = None
        return_dict["logs"] = logs
        return_dict["error"] = {"message": str(e)}

def execute_code(code, tests, timeout=5):
    results = []
    try:
        for test in tests:
            with Manager() as manager:
                return_dict = manager.dict()
                process = Process(target=execute_in_sandbox, args=(code, test["inputs"], return_dict))

                # Uruchomienie procesu
                process.start()
                process.join(timeout)

                # Sprawdzenie, czy proces zakończył się w czasie
                if process.is_alive():
                    process.terminate()
                    process.join()
                    result = {
                        "input": test["inputs"],
                        "expectedOutput": test["expectedOutput"],
                        "actualOutput": None,
                        "passed": False,
                        "logs": [],
                        "error": {"message": "Execution timed out", "stack": None},
                        "hidden" : test["hidden"]
                    }
                else:
                    result = {
                        "input": test["inputs"],
                        "expectedOutput": test["expectedOutput"],
                        "actualOutput": return_dict.get("actual_output"),
                        "passed": return_dict.get("actual_output") == test["expectedOutput"],
                        "logs": return_dict.get("logs", []),
                        "error": return_dict.get("error"),
                        "hidden" : test["hidden"]
                    }

            results.append(result)

        # Ogólny wynik dla wszystkich testów
        success = all(result["passed"] for result in results)
        return {"success": success, "testResults": results}

    except Exception as global_error:
        return {
            "success": False,
            "testResults": None,
            "globalError": {
                "message": str(global_error),
                "stack": traceback.format_exc(),
            },

        }

def run_consumer():
    broker = "kafka:9093"
    input_topic = "python-submission-topic"
    output_topic = "python-solution-topic"

    consumer = KafkaConsumer(
        input_topic,
        bootstrap_servers=[broker],
        group_id="python-solution-group",
        api_version=(2, 8, 1),
        value_deserializer=lambda x: json.loads(x.decode("utf-8"))
    )

    producer = KafkaProducer(
        bootstrap_servers=[broker],
        api_version=(2, 8, 1),
        value_serializer=lambda x: json.dumps(x).encode("utf-8")
    )

    print("Consumer connected to Kafka")
    print("Producer connected to Kafka")

    for message in consumer:
        try:
            payload = message.value

            print("Received code execution request:", payload)

            result = execute_code(payload["code"], payload["testCases"], timeout=5)

            print("Execution Result:", json.dumps(result, indent=2))

            producer.send(
                output_topic,
                {
                    "submissionId": payload["submissionId"],
                    "result": result,
                },
            )

            print("Results sent to Kafka topic:", output_topic)

        except Exception as e:
            print("Error parsing or executing message:", traceback.format_exc())

if __name__ == "__main__":
    run_consumer()
