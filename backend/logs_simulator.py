import random
import yaml
from datetime import datetime, timedelta

# Define sample entries
probes = [
    {"id": "L12345", "type": "Linear", "frequency": "7.5 MHz"},
    {"id": "C78901", "type": "Convex", "frequency": "3.5 MHz"}
]
modes = ["2D", "3D", "Color Doppler", "Power Doppler"]

# Generate simulated logs in YAML format
def generate_yaml_logs(num_entries=50)-> str:
    """
    Generate simulated logs in YAML format
    
    returns the generated YAML file name
    """	
    logs = []
    current_time = datetime.now().replace(microsecond=0)
    
    for i in range(num_entries):
        entry_type = random.choice(["SYSTEM", "SESSION", "ERROR", "PROBE", "CALIBRATION"])
        log_entry = {
            "timestamp": current_time.isoformat() + "Z",
            "event": ""
        }
        
        if entry_type == "SYSTEM":
            log_entry["event"] = "SYSTEM"
            log_entry["details"] = {
                "message": "System booted successfully" if random.choice([True, False]) else "System shutdown initiated",
                "firmware_version": "5.3.2"
            }

        elif entry_type == "PROBE":
            probe = random.choice(probes)
            log_entry["event"] = "PROBE"
            log_entry["details"] = {
                "probe_id": probe["id"],
                "type": probe["type"],
                "frequency": probe["frequency"]
            }

        elif entry_type == "SESSION":
            session_id = random.randint(10000, 99999)
            mode = random.choice(modes)
            depth = random.randint(5, 20)
            gain = random.randint(50, 80)
            log_entry["event"] = "SESSION"
            log_entry["session_id"] = session_id
            log_entry["details"] = {
                "mode": mode,
                "depth": f"{depth}cm",
                "gain": f"{gain}%"
            }

        elif entry_type == "ERROR":
            log_entry["event"] = "ERROR"
            log_entry["details"] = {
                "message": "Probe disconnected unexpectedly" if random.choice([True, False]) else "Network connection lost"
            }
        
        elif entry_type == "CALIBRATION":
            probe = random.choice(probes)
            log_entry["event"] = "CALIBRATION"
            log_entry["details"] = {
                "probe_id": probe["id"],
                "result": "within tolerance"
            }

        # Append log entry to the list
        logs.append(log_entry)
        current_time += timedelta(minutes=random.randint(1, 15))  # Increment time for the next log

    # Save logs to a YAML file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f".\data\device_logs\simulated_ultrasound_logs_{timestamp}.yaml"
    
    with open(filename, "w") as file:
        yaml.dump(logs, file, default_flow_style=False)
    
    return filename



# Sample data for randomized fields
probes = [
    {"id": "L12345", "type": "Linear", "frequency": "7.5 MHz"},
    {"id": "C78901", "type": "Convex", "frequency": "3.5 MHz"}
]
imaging_modes = ["2D", "Doppler", "M-Mode"]
statuses = ["PASS", "FAIL"]

# Function to generate a random self-test report in YAML format
def generate_self_test_report():
    # Create the self-test report structure
    report = {
        "timestamp": datetime.now().isoformat() + "Z",
        "test_id": f"ST-{random.randint(10000, 99999)}",
        "system_status": random.choice(statuses),
        "components_tested": {
            "probe_check": {
                "probe_id": random.choice(probes)["id"],
                "type": random.choice(probes)["type"],
                "connection_status": "Connected" if random.choice([True, False]) else "Disconnected",
                "frequency_response": random.choice(probes)["frequency"]
            },
            "imaging_modes": {mode: random.choice(statuses) for mode in imaging_modes},
            "power_supply": {
                "voltage": f"{random.uniform(22, 26):.1f}V",
                "current": f"{random.uniform(1.2, 1.8):.1f}A",
                "battery_level": f"{random.randint(50, 100)}%"
            },
            "temperature_check": f"{random.randint(35, 40)}°C",
            "network_connectivity": {
                "network_status": "Connected" if random.choice([True, False]) else "Disconnected",
                "signal_strength": f"{random.randint(-80, -50)} dBm"
            }
        },
        "firmware_version": "5.3.2",
        "error_logs": [
            {"error_code": "E-404", "description": "Probe disconnected unexpectedly"} if random.choice([True, False]) else {}
        ],
        "calibration_status": {
            "probe": random.choice(statuses),
            "display": random.choice(statuses)
        },
        "test_duration": f"{random.randint(1, 5)} minutes",
        "recommendations": "None" if random.choice([True, False]) else "Recalibrate probe"
    }

    # Remove empty dictionaries from the error_logs field
    report["error_logs"] = [error for error in report["error_logs"] if error]

    # Generate a filename with the current timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f".\data\self_test_report\self_test_report_{timestamp}.yaml"

    # Save the report to a YAML file
    with open(filename, "w") as file:
        yaml.dump(report, file, default_flow_style=False)

    print(f"Self-test report saved to {filename}")
    return filename




if __name__ == "__main__":
    # # Run the log generation function
    generate_yaml_logs(10)
    
    
    # Run the function to generate a self-test report
    generate_self_test_report()
