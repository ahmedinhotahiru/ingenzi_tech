import random
import yaml
from datetime import datetime, timedelta
import json


# Sample data for randomized fields
probes = [
    {"id": "L12345", "type": "Linear", "frequency": "7.5 MHz"},
    {"id": "C78901", "type": "Convex", "frequency": "3.5 MHz"}
]
imaging_modes = ["2D", "Doppler", "M-Mode"]
statuses = ["PASS", "FAIL"]
firmware_statuses = ["up-to-date", "outdated"]

# Function to generate a random self-test report in YAML format
def generate_self_test_report_yaml():
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


def generate_self_test_report_json() :
    
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
    
    return json.dumps(report)

# Generate simulated logs in YAML format with SYSTEM and additional metrics
def generate_json_logs(num_entries=1):
    logs = []
    current_time = datetime.now().replace(microsecond=0)
    
    # Add a single SYSTEM event at the beginning of the log file
    system_event = {
        "timestamp": current_time.isoformat() + "Z",
        "event": "SYSTEM",
        "details": {
            "startup_status": "System booted successfully" if random.choice([True, False]) else "System boot failed",
            "shutdown_status": "System shutdown successfully" if random.choice([True, False]) else "Unexpected shutdown",
            "firmware_status": random.choice(firmware_statuses)
        }
    }
    logs.append(system_event)
    
    # Increment time for each entry
    for i in range(len(["SESSION", "CALIBRATION"])):
        # Create a log entry with random data
        # entry_type = random.choice(["SESSION", "CALIBRATION"])
        entry_type = ["SESSION", "CALIBRATION"][i]
        
        log_entry = {
            "timestamp": (current_time + timedelta(minutes=random.randint(1, 5))).isoformat() + "Z",
            "event": entry_type,
            "details": {}
        }
        
        # Populate details based on entry type
        if entry_type == "SESSION":
            session_id = random.randint(10000, 99999)
            image_quality = random.randint(50, 100)  # Image quality score out of 10
            battery_status = random.randint(50, 100)  # Battery health in percentage
            log_entry["details"] = {
                "session_id": session_id,
                "image_quality": image_quality,
                "battery_health": battery_status,
                "depth": f"{random.randint(5, 20)}cm",
                "gain": f"{random.randint(50, 80)}%"
            }
        
        elif entry_type == "CALIBRATION":
            probe = random.choice(probes)
            calibration_result = random.choice(statuses)
            log_entry["details"] = {
                "probe_id": probe["id"],
                "calibration_result": calibration_result,
                "callibration_value": random.randint(50,100)
            }

        logs.append(log_entry)
        
        # Increment the current time for the next log entry
        current_time += timedelta(minutes=random.randint(5, 15))
        
    # Save logs to a YAML file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    # filename = f".\data\device_logs\simulated_ultrasound_logs_{timestamp}.yaml"
    filename = f".\data\device_logs\simulated_ultrasound_logs_{timestamp}.json"
    
    with open(filename, "w") as file:
        # yaml.dump(logs, file, default_flow_style=False)
        json.dump(logs, file)
    
    # return filename
    return json.dumps({"fileName":f"simulated_ultrasound_logs_{timestamp}.json", "data": logs})

if __name__ == "__main__":
    # # Run the log generation function
    generate_json_logs(10)
    
    # Run the function to generate a self-test report
    res = generate_self_test_report_json()
    print(res)
