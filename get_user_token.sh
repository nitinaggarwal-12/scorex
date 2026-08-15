#!/bin/bash
# Get OAuth token for the current user

# Use databricks CLI to get a user token
databricks auth token --host https://e2-demo-field-eng.cloud.databricks.com 2>&1
