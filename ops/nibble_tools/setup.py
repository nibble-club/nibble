from setuptools import setup

setup(
    name="nibble_tools",
    version="1.0",
    description="Tools for Nibble",
    url="https://github.com/nibble-club/nibble",
    author="Andrew Churchill",
    license="MIT",
    packages=["nibble_tools"],
    scripts=["bin/aws_mfa"],
    install_requires=["wheel", "boto3"],
    zip_safe=False,
)
